import React from 'react';
import { useRouter } from 'next/router';

export default function CourseDetail() {
  const router = useRouter();
  return <div>{router.query.id}</div>;
}
