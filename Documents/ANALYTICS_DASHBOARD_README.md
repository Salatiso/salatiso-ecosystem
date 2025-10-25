# Analytics Dashboard

The Analytics Dashboard provides comprehensive insights into user engagement and platform performance for the Salatiso Ecosystem.

## Features

### Key Metrics
- **Total Users**: Overall registered users
- **Active Users**: Users active in the selected time period
- **Page Views**: Total page views across the platform
- **Average Session Duration**: Time users spend on the platform

### User Engagement Metrics
- **Courses Started/Completed**: Learning activity tracking
- **Achievements Unlocked**: Gamification progress
- **Messages Sent**: Social interaction metrics

### Content Performance
- **Templates Downloaded**: Business template usage
- **Books Downloaded**: Library content engagement
- **Search Queries**: Content discovery activity

### Business Metrics
- **Projects Viewed**: Project management engagement
- **Business Plans Viewed**: Entrepreneurial activity
- **Career Paths Viewed**: Career development interest

## Access Control

The analytics dashboard is only accessible to users with admin or family_admin roles.

## Configuration

### Google Analytics 4 Setup

1. Create a GA4 property in Google Analytics
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Set the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable

### Environment Variables

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Navigation

Access the analytics dashboard through the intranet navigation under the "Work" section.

## Data Sources

Currently uses mock data for demonstration. In production, integrate with:
- Google Analytics 4 API
- Firebase Analytics
- Custom backend analytics endpoints

## Future Enhancements

- Real-time data integration
- Custom date range selection
- Export functionality
- Advanced filtering and segmentation
- Predictive analytics
- A/B testing results