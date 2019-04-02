import ModelJarDownload from '@ultron/modules/jarDownload/MJarDownload';
import { AModule } from 'com/didichuxing/commonInterface/AModule';
import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { Bind } from 'lodash-decorators';
import { bindObserver } from 'com/didichuxing/commonInterface/TwoWayBinding';
import Layout from '@antd/layout';
import Button from '@antd/button';
import Input from '@antd/input';
import Table from '@antd/table';
import SubMenu from '@ultron/modules/tool/SubMenu';
import Modal from '@antd/modal';
import style from './JarDownload.less';
import { IFile } from 'com/didichuxing/commonInterface/IWeb';
import { getCookie } from '@ultron/business/common/http/cookies';
import { getGenJar } from '@ultron/remote/tool';
import message from '@antd/message';

const { Sider } = Layout;
const ObsInputFileName = bindObserver(Input, 'fileName', 'value');
const url = 'http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=170734641';
const text = '通过“thrift -r --gen java {idl文件或idl文件目录}”生成java文件。';
const text1 = '通过“tar -zcvf {压缩文件名}.tar.gz {java文件所在的目录名}”打成压缩包。';
const text2 = '注：由于mac使用tar打包.tar.gz格式的文件，默认会为每一个文件添加一个前缀为“._”的文件，加上“COPYFILE_DISABLE=1”则可避免此问题。';
const text3 = '例：COPYFILE_DISABLE=1 tar -zcvf test.tar.gz test.java';
const text4 = '在本页面上传.tar.gz压缩包，生成Jar包。';
@observer
export default class JarDownload extends AModule<ModelJarDownload> {
    private refFile: any = null;

    protected createModel(): ModelJarDownload {
        return new ModelJarDownload(this.query);
    }

    @Bind()
    private pushTo(key: string): void {
        this.push({ url: key });
    }

    @Bind()
    private onClickFile(evt): void {
        const dom: any = ReactDOM.findDOMNode(this.refFile);
        dom.value = '';
        dom.click();
    }

    @Bind()
    private async onChangeFile(evt): Promise<void> {
        const files: IFile[] = evt.target.files;
        if (files.length < 1) {
            this.model.setFileName('');
            return;
        }
        const file = files[0];
        if (file.size < 1) {
            Modal.error({
                title: '文件有误',
                content: '文件内容不能为空'
            });
            this.model.setFileName('');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            Modal.error({
                title: '文件过大',
                content: (
                    <div>
                        文件大小不能超过50M，解决方案请查看<a href={ url } target="_blank">文件使用手册</a>
                    </div>
                )
            });
            this.model.setFileName('');
            return;
        }
        const hide = message.loading('文件上传中, 请稍后...', 0);
        const fileName = file.name;
        const data = new FormData();
        data.append('file', file as any);
        try {
            this.model.uploadPath = await getGenJar(data);
            if (this.model.uploadPath &&
                this.model.uploadPath !== '') {
                this.model.setFileName(fileName);
                this.model.isShow = true;
            } else {
                this.model.setFileName('');
            }
        } finally {
            hide();
        }
    }

    @Bind()
    private setRefFile(ref) {
        this.refFile = ref;
    }
    @Bind()
    private isShow(): void {
        this.model.isShow = false;
    }

    private downLoad() {
        const urlStr = '/ultronProxy/tools/downloadJar?filePath=';
        return (
                <a
                    href={ urlStr + this.model.uploadPath }
                    style={ { marginLeft: '15px'} }
                >
                    <Button type="primary" onClick={ this.isShow }>Jar下载</Button>
                </a>
        );
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className={ style.detailLeft }>
                    <Layout>
                        <Sider>
                            <SubMenu pushTo={ this.pushTo }/>
                        </Sider>
                    </Layout>
                </div>
                <div className={ style.detailRight }>
                    <div className={ style.jar }>Jar生成器</div>
                    <div className={ style.config }>
                        <ObsInputFileName
                            className={ style.fileNameInput }
                            model={ this.model }
                            disabled={ true }
                        />
                        <Button type="primary" onClick={ this.onClickFile }>选择文件</Button>
                        {
                            this.model.isShow === true ? this.downLoad() : null
                        }
                        <Input
                            ref={ this.setRefFile }
                            type="file"
                            className={ style.fileInput }
                            onChange={ this.onChangeFile }
                        />
                    </div>
                    <div style={ { marginLeft: '10px', marginTop: '10px'} }>
                        <p className={ style.use }>使用方法：</p>
                        <p>1.{ text }</p>
                        <p>2.{ text1 }</p>
                        <p>3.{ text4 }</p>
                        <p>{ text2 }</p>
                        <p>{ text3 }</p>
                    </div>
                </div>
            </div>
        );
    }
}
