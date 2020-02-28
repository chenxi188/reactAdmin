import React,{Component} from 'react'
import { Upload, Icon, Modal,message } from 'antd';
import {reqDeletPic} from '../../../api' //【1】

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  constructor(props){
    super(props)

    this.state={
      previewVisible: false,
      previewImage: '',
      fileList: []
    }
  }

    /*
  获取所有已上传图片文件名的数组
   */
  getImgs  = () => {
    //返回状态中的文件列表中每个文件的文件名
    return this.state.fileList.map(file => file.name)
  }
  // state = {
  //   previewVisible: false,
  //   previewImage: '',
  //   fileList: [
  //   //   {
  //   //     uid: '-1',
  //   //     name: 'image.png',
  //   //     status: 'done',
  //   //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  //   //   }
  
  //    ],
  // };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

    /*
  file: 当前操作的图片文件(上传/删除)
  fileList: 所有已上传图片文件对象的数组
  官方文档：https://ant.design/components/upload-cn/#onChange
   */
  handleChange = async ({ file,fileList }) => { //【3】async
    console.log('handlechange:',file.status, fileList.length, file===fileList[fileList.length-1])

    // 一旦上传成功, 将当前上传的file的信息修正成最新的(name, url)
    if(file.status==='done'){
      const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
      if(result.status===0){
        message.success('上传成功')
        const {name, url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url           
      }else{
      message.error('上传错误')
      }
    }else if(file.status==='removed'){//【2】如果文件的状态为移除，则删除服务器上对应图片名图片
      const result=await reqDeletPic(file.name)
      if(result.status===0){
        message.success('图片删除成功：'+file.name)
      }else{
        message.error('图片删除失败：'+file.name)
      }
    }

    // 在操作(上传/删除)过程中不断更新fileList状态
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" /**上传图片的接口地址 */
          accept='image/*'  /**只接受图片格式 */
          name='image' /**请求参数名，来自api说明上传图片的参数类型 */
          listType="picture-card" /*卡片样式：text, picture 和 picture-card*/
          fileList={fileList} /*所有已上传图片文件对象的数组*/
          onPreview={this.handlePreview} /**显示图片预览函数 */
          onChange={this.handleChange} /**上传/删除图片函数 */
        >
          {//控制图片上传按钮最多5个
          fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}