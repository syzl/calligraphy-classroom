import React, { useState } from 'react';
import { Upload, Icon, Modal } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { SERVER_URL } from '../../lib/constant';
import { deleteUpload } from '../../lib/api';

function getBase64(file: File | Blob | undefined): Promise<string> {
  if (!file) {
    return Promise.resolve('');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </div>
);

export default function CreateUploads({
  onCompleted,
}: {
  onCompleted?: Function;
}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('initialState');
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  return (
    <>
      <Upload
        multiple={true}
        action={`${SERVER_URL}/api/v1/upload/antd`}
        listType="picture-card"
        fileList={fileList}
        onPreview={async file => {
          if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
          }
          setPreviewImage(file.url || file.preview || '');
          setPreviewVisible(true);
        }}
        onChange={({ fileList, event }) => {
          setFileList([...fileList]);
          if (event) {
            onCompleted && onCompleted();
          }
        }}
        onDownload={file => {
          const { response: { url = '' } = {} } = file;
          window.open(`${SERVER_URL}${url}`, '_blank');
        }}
        onRemove={async file => {
          const { id } = file.response || {};
          if (id) {
            await deleteUpload(file.response.id);
            return true;
          } else {
            return true;
          }
        }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
