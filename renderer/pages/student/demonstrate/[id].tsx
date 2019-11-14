import React from 'react';
import { useRouter } from 'next/router';

export default function DemonstrateDetail() {
  const router = useRouter();
  return <div>{router.query.id}</div>;
}
