import React, { Component } from 'react';
import { EditorState, convertToRaw,ContentState } from 'draft-js'; //【3】引入ContentState
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'; //【0】显示现有html需要组件
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css' //引入编辑器样式，否则会乱七八糟
import PropTypes from 'prop-types' //【1】引入proptypes用于接收父组件传值


export default class RichText extends Component {
  //【2】接收父组件传值
  static propTypes={
    detail:PropTypes.string
  }

  state = {
    editorState: EditorState.createEmpty(),
  }

  //【4】rich-text官网拉到底找到把现成的字符串显示到富文本编辑框内
  constructor(props) {
    super(props)

    const html = this.props.detail //解构出传过来的detail内的html数据

    if (html) { // 【5】html如果有值, 根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      this.state = {
        editorState,
      }
    } else {//【6】没有则让富文本框创建空对象
      this.state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
      }
    }

  }

  onEditorStateChange=(editorState) => { //标签写法改成如左写法
    this.setState({
      editorState,
    });
  };

 //让父组件获取到当前组件的信息
 getDetail=()=>{
     return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
 }

 //【2】图片上传加一个上传按钮
 uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url // 得到图片的url
          resolve({data: {link: url}})
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    )
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
          onEditorStateChange={this.onEditorStateChange}
          /**【1】图片上传按钮配置*/
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
      </div>
    );
  }
}