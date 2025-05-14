'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { contactSchema, ContactSchema } from '@/lib/validations/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

export default function Contact() {
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  });

  const handleSendMessage = async (data: ContactSchema) => {
    setError(null);

    try {
      await toast.promise(
        (async () => {
          const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to send message');
          }

          return response.json();
        })(),
        {
          loading: 'Sending message...',
          success: 'Message sent successfully!',
          error: (err) => err.message || 'An error occurred while sending the message',
        }
      );

      reset(); // Clear form after success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
          <form onSubmit={handleSubmit(handleSendMessage)}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium">
                Name
              </label>
              <input
                id="name"
                {...register('name')}
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                {...register('email')}
                type="email"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <textarea
                id="message"
                {...register('message')}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              {errors.message && (
                <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>

            {error && (
              <p className="text-red-600 text-xs mt-4 text-center">{error}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
