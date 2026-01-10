
import React, { useEffect } from 'react';
import { PageView } from '../types';

interface MetaSEOProps {
  view: PageView;
}

const MetaSEO: React.FC<MetaSEOProps> = ({ view }) => {
  const baseUrl = "https://drivesafemate.com.au";
  
  const config = {
    [PageView.HOME]: {
      title: "DriveSafeMate Academy | Australia's Best Driving Lessons",
      description: "Master the roads from the Bush to the Beach. Book certified driving instructors across Sydney, Melbourne, and Brisbane. AI-powered learning for L-Plate and P-Plate success.",
      canonical: baseUrl,
    },
    [PageView.ABOUT]: {
      title: "About Us | DriveSafeMate Driving School Australia",
      description: "Learn about Australia's leading tech-driven driving academy. Our mission is to make Australian roads safer through professional 5-star ANCAP rated training.",
      canonical: `${baseUrl}/about`,
    },
    [PageView.SERVICES]: {
      title: "Driving Lesson Packages & Pricing | Sydney, VIC, QLD",
      description: "Affordable driving lesson packages. L-Plate foundations, test prep, and defensive driving courses. Manual and Automatic instructors available Australia-wide.",
      canonical: `${baseUrl}/services`,
    },
    [PageView.CONTACT]: {
      title: "Contact DriveSafeMate | Find a Driving Instructor Near You",
      description: "Get in touch with Australia's top driving school. Book your first lesson in Sydney, Melbourne, Brisbane or Perth today. 1300 DRIVE MATE.",
      canonical: `${baseUrl}/contact`,
    },
    [PageView.DASHBOARD]: {
      title: "Dashboard | DriveSafeMate Learning Portal",
      description: "Manage your driving hours, logbook entries, and upcoming lessons.",
      canonical: `${baseUrl}/dashboard`,
    }
  };

  const current = config[view] || config[PageView.HOME];

  useEffect(() => {
    document.title = current.title;
    
    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', current.description);

    // Update Canonical
    let linkCan = document.querySelector('link[rel="canonical"]');
    if (!linkCan) {
      linkCan = document.createElement('link');
      linkCan.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCan);
    }
    linkCan.setAttribute('href', current.canonical);
  }, [view, current]);

  // Schema.org Structured Data for Australian Local Business
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "DriveSafeMate Academy",
    "alternateName": "DriveSafeMate Driving School",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AU",
      "addressRegion": "NSW",
      "addressLocality": "Sydney"
    },
    "description": "Premium Australian driving school providing AI-powered learning paths and professional instructor bookings.",
    "sameAs": [
      "https://www.facebook.com/drivesafemate",
      "https://www.instagram.com/drivesafemate"
    ],
    "areaServed": [
      { "@type": "State", "name": "New South Wales" },
      { "@type": "State", "name": "Victoria" },
      { "@type": "State", "name": "Queensland" },
      { "@type": "State", "name": "Western Australia" }
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schemaData)}
    </script>
  );
};

export default MetaSEO;
