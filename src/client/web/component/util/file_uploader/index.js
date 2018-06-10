import  { Upload, Icon, message } from 'antd';
import React from 'react';

const Dragger = Upload.Dragger;
const props = {
    name: 'file',
    multiple: true,
    onChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

class FileUploader extends  React.Component {
    constructor(props) {
        super(props);
    }
    render (){
      let props_list = props;
      props_list.accept = this.props.accept;
      props_list.action = this.props.action;

      return (
          <Dragger {...props_list}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload.</p>
          </Dragger>
        );
    }
}

export default FileUploader;
