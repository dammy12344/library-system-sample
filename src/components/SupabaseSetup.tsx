import React from 'react';
import { Database, ExternalLink, Settings } from 'lucide-react';

export function SupabaseSetup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Database className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Database Setup Required
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect to Supabase to start using the Library Management System
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Click the Settings Icon
                </p>
                <p className="text-sm text-gray-500">
                  Look for the settings icon at the top of the preview area
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Select "Supabase"
                </p>
                <p className="text-sm text-gray-500">
                  Choose the Supabase option from the settings menu
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Connect Your Database
                </p>
                <p className="text-sm text-gray-500">
                  Follow the prompts to set up your Supabase connection
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Settings className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    What happens next?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Once connected, the system will automatically create the necessary database tables 
                      and security policies for your Library Management System.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://supabase.com/docs/guides/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Need help? View Supabase Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}