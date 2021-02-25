import React from 'react';
import "../css/ImageUpload.scss";

export interface Props {
    handleUploadPhoto: Function
}

export default class ImageUpload extends React.Component<Props> {
    constructor(props: Props) {
      super(props);
      this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    convertBase64(file: File) {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
      }

    async onChangeHandler(event: any) {
        const file = event.target.files[0]
        const base64 = await this.convertBase64(file)
        this.props.handleUploadPhoto(base64);
    }

    render() {
        return (
            <form method="post" action="#" id="#">
                Upload Your File
                <div className="form-group files">
                    <input type="file" accept="image/*" className="form-control" onChange={this.onChangeHandler} />
                </div>
            </form>
        );
    }
}
