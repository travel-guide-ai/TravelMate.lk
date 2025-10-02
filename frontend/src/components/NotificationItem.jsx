import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  User, 
  Heart, 
  MessageCircle, 
  Star, 
  MapPin, 
  Award, 
  AlertTriangle,
  Gift,
  X,
  Archive,
  Eye
} from 'lucide-react';

const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onArchive,
  className = '' 
}) => {
  const getNotificationIcon = (type) => {
    const iconMap = {
      follow: User,
      unfollow: User,
      like: Heart,
      comment: MessageCircle,
      review: Star,
      itinerary_shared: MapPin,
      destination_recommendation: MapPin,
      friend_activity: User,
      system_update: Bell,
      welcome: Gift,
      achievement: Award,
      reminder: Bell,
      booking_confirmation: MapPin,
      travel_alert: AlertTriangle,
    };
    
    const IconComponent = iconMap[type] || Bell;
    return <IconComponent className="w-5 h-5" />;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'urgent') return 'text-red-500 bg-red-50 border-red-200';
    if (priority === 'high') return 'text-blue-500 bg-blue-50 border-blue-200';
    
    const colorMap = {
      follow: 'text-green-500 bg-green-50 border-green-200',
      like: 'text-pink-500 bg-pink-50 border-pink-200',
      comment: 'text-blue-500 bg-blue-50 border-blue-200',
      review: 'text-yellow-500 bg-yellow-50 border-yellow-200',
      achievement: 'text-purple-500 bg-purple-50 border-purple-200',
      travel_alert: 'text-red-500 bg-red-50 border-red-200',
    };
    
    return colorMap[type] || 'text-gray-500 bg-gray-50 border-gray-200';
  };

  const handleAction = (action, event) => {
    event.stopPropagation();
    
    switch (action) {
      case 'read':
        onMarkAsRead && onMarkAsRead(notification._id);
        break;
      case 'delete':
        onDelete && onDelete(notification._id);
        break;
      case 'archive':
        onArchive && onArchive(notification._id);
        break;
    }
  };

  const handleNotificationClick = () => {
    // Mark as read when clicked
    if (notification.status === 'unread') {
      onMarkAsRead && onMarkAsRead(notification._id);
    }
    
    // Navigate to action URL if provided
    if (notification.data?.actionUrl) {
      window.location.href = notification.data.actionUrl;
    }
  };

  const isUnread = notification.status === 'unread';
  const iconColorClass = getNotificationColor(notification.type, notification.priority);
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  return (
    <div 
      className={`
        relative p-4 border rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer
        ${isUnread 
          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
        }
        ${className}
      `}
      onClick={handleNotificationClick}
    >
      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center
          ${iconColorClass}
        `}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                {notification.title}
              </p>
              <p className={`text-sm mt-1 ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                {notification.message}
              </p>
              
              {/* Grouped notification indicator */}
              {notification.isGrouped && notification.groupCount > 1 && (
                <div className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                  +{notification.groupCount - 1} more
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {isUnread && (
                <button
                  onClick={(e) => handleAction('read', e)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="Mark as read"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              
              <button
                onClick={(e) => handleAction('archive', e)}
                className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
                title="Archive"
              >
                <Archive className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => handleAction('delete', e)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>{timeAgo}</span>
              
              {/* Priority indicator */}
              {notification.priority === 'high' && (
                <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                  High
                </span>
              )}
              
              {notification.priority === 'urgent' && (
                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                  Urgent
                </span>
              )}
            </div>

            {/* Sender info */}
            {notification.sender && (
              <div className="flex items-center space-x-1">
                {notification.sender.profile?.avatar ? (
                  <img
                    src={notification.sender.profile.avatar}
                    alt={notification.sender.profile.username}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                )}
                <span className="text-xs text-gray-500">
                  {notification.sender.profile?.firstName} {notification.sender.profile?.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;