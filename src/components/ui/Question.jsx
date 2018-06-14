import React from 'react'
import { Accordion, Toast } from 'antd-mobile';
import '../assets/css/question.css';
import { initHeight } from '../assets/js/utils'
import axios from 'axios'
import PropTypes from 'prop-types'
import {store} from '../../store/index.js';
import * as configAction from '../../actions/configAction';

class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialHeight: 200,
            data: [],
            baseurl: props.baseurl
        }
    }

    onChange = (key) => {

    }

    getData(){
        Toast.loading('加载中…', 30);
        axios({
            method: 'post',
            url: this.state.baseurl + '/api/question',
            data: {},
        }).then(function (response) {
            Toast.hide();
            if(response.status == 200 && response.data.code == 0){
                this.setState({
                    data: response.data.data
                });
            }
        }.bind(this)).catch(function (error) {
            Toast.hide();
            Toast.fail('获取失败', 2);
        }.bind(this));
    }

    componentWillMount(){
        document.title = '常见问题';
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
                <div className="am-list-header-question">APP及常见问题</div>
            </div>
        );
    }
}

Question.propTypes = {
    baseurl: PropTypes.string.isRequired
}

export default Question

