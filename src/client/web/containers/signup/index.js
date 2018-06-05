import React from 'react';
import axios from 'axios';
import { Form, Input, Tooltip, Icon,  Select,  Checkbox, Button, message } from 'antd';

import { withRouter } from 'react-router-dom';
import './index.scss';

const FormItem = Form.Item;

class SignUPForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
      };
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/auth/register', values).then( (response)=>{
                    //console.log(response.data);
                    if (response.data.status === 'success') {
                        //window.location.href = '/';
                        this.props.history.push("/login");
                    } else {
                        message.error(response.data.errmsg);
                    }
                }).catch(function(error) {
                    message.error('服务器似乎开小差去了～');
                    console.log(error);
                });
            } else {
                message.error(err);
            }
        });
      }
      handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      }
      compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
      }
      validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    
  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <option value="86">+86</option>
        <option value="1">+1</option>
      </Select>
    );



    const Username_JSX = (
        <FormItem
        {...formItemLayout}
        label="Username"
        >
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
        })(
          <Input />
        )}
      </FormItem>
    );

    const Email_JSX = (
        <FormItem
        {...formItemLayout}
        label="E-mail" >
        {getFieldDecorator('email', {
          rules: [{
            type: 'email', message: 'The input is not valid E-mail!',
          }, {
            required: true, message: 'Please input your E-mail!',
          }],
        })(
          <Input />
        )}
      </FormItem>
    );

    const Password_JSX = (
        <FormItem
        {...formItemLayout}
        label="Password"
      >
        {getFieldDecorator('password', {
          rules: [{
            required: true, message: 'Please input your password!',
          }, {
            validator: this.validateToNextPassword,
          }],
        })(
          <Input type="password" />
        )}
      </FormItem>
    );

    const ConfirmPassword_JSX = (
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
    );

    const PhoneNumber_JSX = (
        <FormItem
          {...formItemLayout}
          label="Phone Number"
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
          )}
        </FormItem>
    );

    const Aggreement_JSX = (
        <FormItem {...tailFormItemLayout}>
        {getFieldDecorator('agreement', {
          valuePropName: 'checked',
        })(
          <Checkbox>I have read the <a href="">agreement</a></Checkbox>
        )}
      </FormItem>
    );

    return (
      <div className="signupDIV">
        <div className="signupform">
        <h1 >SignUp</h1>
        <div className="signupform-inner">
         <Form onSubmit={this.handleSubmit} >
        {Username_JSX}
        {Email_JSX}
        {Password_JSX}
        {ConfirmPassword_JSX}
        {PhoneNumber_JSX}
        {Aggreement_JSX}
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">Register</Button>
        </FormItem>
      </Form>
      </div>
      </div>
      </div>
    );
  }
}

const WrappedSignUPForm = Form.create()(withRouter(SignUPForm));

export default WrappedSignUPForm;