import React from 'react'
import { H2, H4 } from '../../shared/typography'
import { Button } from '../../ui/button'
import { Link } from 'react-router-dom'
import AnnouncementList from './AnnouncementList'

const Announcement = () => {
  return (
    <div className='space-y-6'>
      <div className="flex gap-5 justify-between items-center">
        <H4>Announcements</H4>
        <Button asChild variant='abhicares'>
          <Link to="/admin/banner/add-announcement">Add</Link>
        </Button>
      </div>

      <AnnouncementList />
    </div>
  );
}

export default Announcement