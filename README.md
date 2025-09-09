# Subly - Subscription & Document Management SaaS

A modern, full-stack SaaS application built with React.js and Supabase for tracking subscriptions, managing receipts, and organizing documents with real-time updates.

## 🚀 Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Real-time Dashboard**: Live updates for subscriptions and documents
- **Subscription Management**: Track costs, renewal dates, billing cycles
- **Document Storage**: Upload, categorize, and search documents with Supabase Storage
- **Search & Filter**: Advanced search across all content with category filters
- **Mobile Responsive**: Optimized for all devices with Tailwind CSS
- **Analytics**: Dashboard insights on spending and subscription trends
- **File Upload**: Drag-and-drop document uploads with progress tracking

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Forms**: React Hook Form with Yup validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

## 📦 Installation

1. **Clone and Setup**
   ```bash
   # Repository is already set up in Bolt.new
   npm install
   ```

2. **Supabase Setup**
   - Click "Connect to Supabase" in the top right
   - Create a new Supabase project
   - The environment variables will be automatically configured

3. **Database Setup**
   The database schema is automatically applied via migrations in `/supabase/migrations/`

4. **Storage Setup**
   **IMPORTANT**: Create a storage bucket named `documents` in your Supabase dashboard:
   - Go to Storage in Supabase dashboard
   - Click "New bucket"
   - Name it exactly `documents` (lowercase)
   - Set it to **Public** bucket
   - Click "Create bucket"
   
   **Note**: The application will not work without this bucket. You'll see "Bucket not found" errors when trying to upload documents.

## 🏃‍♂️ Running the Application

```bash
npm run dev
```

The application will be available at the local development URL.

## 📊 Database Schema

### Tables

- **profiles**: User profile information
- **subscriptions**: Subscription tracking with costs and renewal dates
- **documents**: Document metadata with file storage references
- **notifications**: System notifications for users

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure file uploads with user-based path structure

## 🔧 Configuration

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Storage Configuration

Documents are stored in Supabase Storage with the following structure:
```
documents/
├── {user_id}/
│   ├── {timestamp}.{extension}
│   └── ...
```

## 🎨 UI/UX Features

- **Modern Design**: Purple-blue gradient theme with card-based layouts
- **Smooth Animations**: Hover effects and micro-interactions
- **Responsive Grid**: Adapts to mobile, tablet, and desktop
- **Search Integration**: Real-time search with category filtering
- **File Management**: Drag-and-drop uploads with preview

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-optimized interactions
- Mobile-friendly navigation
- Optimized file upload on mobile devices

## 🔄 Real-time Features

- Live subscription updates across all clients
- Instant document uploads and changes
- Real-time dashboard statistics
- Automatic UI synchronization

## 🚀 Deployment

The application can be deployed using:

1. **Bolt Hosting** (recommended for this setup)
   - Use the deploy button in the Bolt.new interface
   - Automatic environment variable configuration

2. **Vercel/Netlify**
   - Connect your repository
   - Add environment variables
   - Deploy with automatic builds

## 📊 Data Models

### Subscription
- Service name, cost, renewal date
- Billing cycle (weekly, monthly, quarterly, yearly)
- Category and notes
- Active status tracking

### Document
- Title, category, file metadata
- Tag-based organization
- Upload date and file size tracking
- Secure file storage references

## 🔐 Security Features

- Row Level Security policies
- User-based data isolation
- Secure file upload with validation
- Authentication state management
- Protected API endpoints

## 🎯 Future Enhancements

- Email notifications for renewals
- Advanced analytics and reporting
- Subscription optimization suggestions
- Team collaboration features
- API integrations for automatic tracking
- Bulk import/export functionality

## 📞 Support

This is a complete, production-ready SaaS application. The codebase is well-documented and follows React best practices for maintainability and scalability.

---

Built with ❤️ using React.js and Supabase