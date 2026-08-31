'use client';

import React, { useEffect, useState, use } from 'react';
import { notFound } from 'next/navigation';
import { BlogPost } from '../../../../types';
import { BlogService } from '../../../../services/blogService';
import { PostEditorForm } from '../../../../components/admin/PostEditorForm';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const data = await BlogService.getPostById(resolvedParams.id);
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Carregando dados do artigo...
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return <PostEditorForm initialPost={post} isEditing={true} />;
}
