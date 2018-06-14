import React from 'react'
import { Carousel, Toast } from 'antd-mobile';
import '../assets/css/about.css';
import { initHeight } from '../assets/js/utils'
import axios from 'axios'
import PropTypes from 'prop-types'
import {store} from '../../store/index.js';
import * as configAction from '../../actions/configAction';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            initialHeight: 200,
            page: 0,
            baseurl: props.baseurl
        }
    }

    getData(){
        Toast.loading('加载中…', 30);
        axios({
            method: 'post',
            url: this.state.baseurl + '/api/about',
            data: {},
        }).then(function (response) {
            Toast.hide();
            if(response.status == 200 && response.data.code == 0){
                let tmp = response.data.data;
                let data = [];
                for(let i=0; i<tmp.length; i++){
                    data.push(this.state.baseurl + tmp[i].url);
                }

                this.setState({
                    data: data
                });
            }
        }.bind(this)).catch(function (error) {
            Toast.hide();
            Toast.fail('获取失败', 2);
        }.bind(this));
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

    componentWillMount(){
        document.title = '产品手册';
    }

    render() {
        return (
            <div className="about-page">
                <div>产品手册</div>
            </div>
        );
    }
}

About.propTypes = {
    baseurl: PropTypes.string.isRequired
}

export default About

