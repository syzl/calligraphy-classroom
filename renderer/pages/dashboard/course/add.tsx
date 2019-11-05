import React from 'react';
import { useRouter } from 'next/router';
import { withApollo } from '../../../lib/apollo';
import CreateCourse from '../../../components/forms/Course';

export default withApollo(function Add() {
  const { push } = useRouter();
  return (
    <div>
      <h1>添加</h1>
      <div>
        <CreateCourse
          clearCache={true} // 默认 true
          onCompleted={() => {
            push('/dashboard/course');
          }}
        />
      </div>
    </div>
  );
});
