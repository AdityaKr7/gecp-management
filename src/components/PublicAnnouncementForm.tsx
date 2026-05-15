import React, { useState, useEffect } from 'react';
import { X, Trash2, ExternalLink } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface PublicAnnouncementFormProps {
  onClose: () => void;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  link?: string;
  createdAt: string;
}

export default function PublicAnnouncementForm({ onClose }: PublicAnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'publicAnnouncements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'publicAnnouncements'), {
        title,
        content,
        link: link.trim() ? link.trim() : null,
        createdAt: new Date().toISOString()
      });
      setTitle('');
      setContent('');
      setLink('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'publicAnnouncements');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteDoc(doc(db, 'publicAnnouncements', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'publicAnnouncements');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">Manage Public Marquee</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
          <h3 className="font-bold text-gray-700">Add New Announcement</h3>
          <input 
            type="text" 
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-white rounded-2xl border font-bold text-lg text-gray-900"
            required
          />
          <textarea 
            placeholder="Announcement Details"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-white rounded-2xl border font-medium h-24 text-base text-gray-900"
            required
          />
          <input 
            type="url" 
            placeholder="Document/Drive Link (Optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full p-4 bg-white rounded-2xl border font-medium text-base text-gray-900"
          />
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-3 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition"
          >
            {submitting ? 'Publishing...' : 'Publish Announcement'}
          </button>
        </form>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-700">Current Announcements</h3>
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No running announcements.</p>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="p-4 border border-gray-100 rounded-2xl flex justify-between items-start bg-white hover:shadow-md transition">
                <div className="pr-4">
                  <h4 className="font-bold text-gray-900">{ann.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                  {ann.link && (
                    <a href={ann.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-bold text-blue-600 mt-2 hover:underline">
                      <ExternalLink className="w-3 h-3 mr-1" /> View Attached Link
                    </a>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(ann.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition shrink-0"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}