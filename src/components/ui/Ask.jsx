import React from 'react'
import { ImagePicker, TextareaItem, List, Button, WingBlank, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import '../assets/css/ask.css';
import axios from 'axios'
import PropTypes from 'prop-types'
import {store} from '../../store/index.js';
import * as configAction from '../../actions/configAction';

class Ask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            loading: false,
            question: '',
            token: props.token,
            apiurl: props.apiurl,
            pictures: [],
            extensions: [],
            type: 'Other',
            deviceId: ''
        }
    }

    onChange = (files, type, index) => {
        this.setState({
            files
        });

        if(typeof(files) == 'object' && files.length > 0){
            var extensions = [];
            var pictures = [];
            for(var i=0; i<files.length; i++) {
                var temp = files[i].file.name;
                var arr = temp.split('.');

                if (typeof(arr) == 'object' && arr.length > 0) {
                    extensions.push(arr[1]);
                }

                var str = files[i].url;
                var equalIndex = str.indexOf(',');
                var url = str.substring(equalIndex + 1);
                pictures.push(url);
            }

            if(extensions.length > 0){
                this.setState({
                    extensions: extensions
                })
            }

            if(pictures.length > 0){
                this.setState({
                    pictures: pictures
                })
            }
        }
    }

    questionChange(value){
        this.setState({
            question: value
        });
    }

    submit(){
        return false;
        if(this.state.question == ''){
            Toast.info('请输入您的问题', 1);
            return false;
        }

        this.setState({
            loading: true
        });

        axios({
            method: 'post',
            url: this.state.apiurl + '/v1/question/create?access_token=' + this.state.token,
            data: {
                description: this.state.question,
                pictures: this.state.pictures,
                extensions: this.state.extensions,
                type: this.state.type,
                deviceId: this.state.deviceId
            },
            transformRequest: [function (data) {
                let param = ''
                for (let it in data) {
                    param += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return param
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            if(response.status == 200 && response.data.code == 0){
                this.setState({
                    question: '',
                    files: [],
                    loading: false
                });
                Toast.success('提交成功', 2);
            }
            else{
                this.setState({
                    loading: false
                });
                Toast.fail('提交失败', 2);
            }
        }.bind(this)).catch(function (error) {
            this.setState({
                loading: false
            });
            Toast.fail('提交失败', 2);
        }.bind(this));
    }

    componentDidMount(){
        let baseurl = '';
        store.dispatch(configAction.update_base_url(baseurl));
    }

    componentWillMount(){
        document.title = '问题反馈';
    }

    render() {
        const { getFieldProps } = this.props.form;
        return (
            <div style={{ marginBottom: 10 }}>
                <List renderHeader={() => '问题反馈'}>
                    <TextareaItem
                        {...getFieldProps('count', {
                            initialValue: '',
                        })}
                        clear
                        value={this.state.question}
                        onChange={this.questionChange.bind(this)}
                        placeholder={'请输入问题描述...'}
                        rows={5}
                        count={100}
                    />
                </List>
                <ImagePicker
                    files={this.state.files}
                    onChange={this.onChange}
                    selectable={this.state.files.length < 5}
                />
                <WingBlank size="md">
                    <Button className="btn" type="primary" disabled={this.state.loading} loading={this.state.loading} onClick={this.submit.bind(this)}>提交</Button>
                </WingBlank>
            </div>
        );
    }
}

Ask.propTypes = {
    apiurl: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired
}

const AskComponent = createForm()(Ask);
export default AskComponent

