import React   from 'react';
import  { Upload, Icon, message } from 'antd';
import Content from '../../component/layout/content';

const Dragger = Upload.Dragger;
const props = {
    name: 'file',
    multiple: true,
    accept:'.xls,.csv,.pdf',
    action: '/api/tradelog/upload',
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


class UploadTradeLog extends React.Component{
    render() {     
        return (
                <Content>
                    上传交易数据
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Dragger>
                </Content>
        );
    } 
}

export default UploadTradeLog;