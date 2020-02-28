import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css' //引入编辑器样式，否则会乱七八糟


export default class RichText extends Component {
  state = {
    editorState: EditorState.createEmpty(),
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