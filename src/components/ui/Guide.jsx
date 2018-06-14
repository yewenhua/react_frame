import React from 'react'
import { WingBlank, Toast } from 'antd-mobile';
import '../assets/css/guide.css';
import { initHeight } from '../assets/js/utils'
import axios from 'axios'
import PropTypes from 'prop-types'
import {store} from '../../store/index.js';
import * as configAction from '../../actions/configAction';

class Guide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialHeight: 200,
            data: null,
            baseurl: props.baseurl
        }
    }

    getData(){
        Toast.loading('加载中…', 30);
        axios({
            method: 'post',
            url: this.state.baseurl + '/api/guide',
            data: {},
        }).then(function (response) {
            Toast.hide();
            if(response.status == 200 && response.data.code == 0){
                this.setState({
                    data: response.data.data.content
                });
            }
        }.bind(this)).catch(function (error) {
            Toast.hide();
            Toast.fail('获取失败', 2);
        }.bind(this));
    }

    componentWillMount(){
        document.title = '门锁用户添加说明';
    }

    componentDidMount() {
        let { viewHeight } = initHeight();

        this.setState({
            initialHeight: viewHeight
        });

        let baseurl = '';
        store.dispatch(configAction.update_base_url(baseurl));
        //this.getData();
    }

    render() {
        return (
            <div className="content">
                <div>门锁用户添加说明</div>
            </div>
        );
    }
}

Guide.propTypes = {
    baseurl: PropTypes.string.isRequired
}

export default Guide

