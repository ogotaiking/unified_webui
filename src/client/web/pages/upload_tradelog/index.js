import React   from 'react';
import  { Upload, Icon, message } from 'antd';
import Content from '../../component/layout/content';

import FileUploader from '../../component/util/file_uploader';

class UploadTradeLog extends React.Component{
    render() {     
        return (
                <Content>
                    上传买入交易数据
                   <FileUploader accept=".csv,.xls" action="/api/tradelog/upload/buy" />

                   上传卖出交易数据
                   <FileUploader accept=".csv,.xls" action="/api/tradelog/upload/sell" />




                </Content>
        );
    } 
}

export default UploadTradeLog;