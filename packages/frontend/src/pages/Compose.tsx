import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useDropzone } from 'react-dropzone';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  CalendarIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const platforms = [
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    color: 'bg-blue-600', 
    icon: '💼',
    maxLength: 3000 
  },
  { 
    id: 'twitter', 
    name: 'Twitter/X', 
    color: 'bg-black', 
    icon: '𝕏',
    maxLength: 280 
  },
  { 
    id: 'reddit', 
    name: 'Reddit', 
    color: 'bg-orange-600', 
    icon: '🗨️',
    maxLength: 40000 
  },
  { 
    id: 'hackernews', 
    name: 'Hacker News', 
    color: 'bg-orange-500', 
    icon: '📰',
    maxLength: 2000 
  },
];

export default function Compose() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'What would you like to share today?',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.avi', '.mov'],
    },
    maxFiles: 5,
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles]);
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
    },
    onDropRejected: (rejectedFiles) => {
      toast.error('Some files were rejected. Please check file type and size.');
    },
  });

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!editor?.getText().trim()) {
      toast.error('Please enter some content');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    const postData = {
      content: editor.getHTML(),
      platforms: selectedPlatforms,
      scheduledAt: isScheduled ? scheduledDate : null,
      files: uploadedFiles,
    };

    try {
      // TODO: Submit to API
      console.log('Submitting post:', postData);
      
      if (isScheduled) {
        toast.success('Post scheduled successfully!');
      } else {
        toast.success('Post published successfully!');
      }
      
      // Reset form
      editor?.commands.clearContent();
      setUploadedFiles([]);
      setSelectedPlatforms(['linkedin']);
      setScheduledDate('');
      setIsScheduled(false);
    } catch (error) {
      toast.error('Failed to publish post');
    }
  };

  const getCharacterCount = () => {
    return editor?.getText().length || 0;
  };

  const getMaxLength = () => {
    const selectedPlatformData = platforms.filter(p => selectedPlatforms.includes(p.id));
    return Math.min(...selectedPlatformData.map(p => p.maxLength));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Compose Post</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsScheduled(!isScheduled)}
              className={`btn ${isScheduled ? 'btn-primary' : 'btn-secondary'}`}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {isScheduled ? 'Scheduled' : 'Schedule'}
            </button>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <label className="label">Select Platforms</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg mr-2">{platform.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {platform.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {platform.maxLength} chars
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scheduled Date */}
        {isScheduled && (
          <div className="mb-6">
            <label className="label">Schedule Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="input"
            />
          </div>
        )}

        {/* Content Editor */}
        <div className="mb-6">
          <label className="label">Content</label>
          <div className="border border-gray-300 rounded-md min-h-[250px] bg-white">
            <EditorContent editor={editor} />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>
              {getCharacterCount()} / {getMaxLength()} characters
            </span>
            {getCharacterCount() > getMaxLength() && (
              <span className="text-red-500 font-medium">
                Content exceeds limit for selected platforms
              </span>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="label">Media (Images & Videos)</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex justify-center space-x-4 mb-4">
              <PhotoIcon className="w-12 h-12 text-gray-400" />
              <VideoCameraIcon className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {isDragActive
                ? 'Drop files here...'
                : 'Drag & drop media files here, or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports images and videos up to 50MB each
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <VideoCameraIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button className="btn-secondary">
            <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
            Save as Draft
          </button>
          
          <div className="flex space-x-3">
            <button className="btn-secondary">
              Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={getCharacterCount() > getMaxLength()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-4 h-4 mr-2" />
              {isScheduled ? 'Schedule Post' : 'Publish Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 