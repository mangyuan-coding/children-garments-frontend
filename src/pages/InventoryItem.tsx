import React, {FC, useEffect} from 'react';
import {Button, Form, Input, Modal, Result} from 'antd';
import {InventoryItemModel, Sale} from './inventory.d';
import styles from './style.less';

interface InventoryItemProps {
  done: boolean;
  visible: boolean;
  sale: boolean;
  current: Partial<InventoryItemModel> | undefined;
  onDone: () => void;
  onSubmit: (sale: boolean, values: InventoryItemModel | Sale) => void;
  onCancel: () => void;
}

const formLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 13},
};

const InventoryItem: FC<InventoryItemProps> = (props) => {
  const [form] = Form.useForm();
  const {done, visible, current, sale, onDone, onCancel, onSubmit} = props;

  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);

  useEffect(() => {
    if (current) {
      form.setFieldsValue({
        ...current,
      });
    }
  }, [props.current]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (values: { [key: string]: any }) => {
    if (onSubmit) {
      onSubmit(sale, sale ? values as Sale : values as InventoryItemModel);
    }
  };

  const modalFooter = done
    ? {footer: null, onCancel: onDone}
    : {okText: '保存', onOk: handleSubmit, onCancel};

  const getModalContent = () => {
    if (done) {
      return (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      );
    }
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <div hidden={!sale}>
          <Form.Item
            name="price"
            label="销售价格"
            rules={[{required: sale, message: '请输入价格'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item
            name="saleQuantities"
            label="销售数量"
            rules={[{required: sale, message: '请输入数量'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
        </div>
        <div hidden={sale}>
          <Form.Item
            name="purchaseOrder"
            label="采购单"
            rules={[{required: !sale, message: '请输入采购单编号'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item
            name="product"
            label="产品"
            rules={[{required: !sale, message: '请输入产品名称'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item
            name="size"
            label="尺码"
            rules={[{required: !sale, message: '请输入尺码'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item
            name="purchaseQuantities"
            label="采购数量"
            rules={[{required: !sale, message: '请输入采购数量'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item
            name="purchaseCost"
            label="采购单价"
            rules={[{required: !sale, message: '请输入采购单价'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
          <Form.Item
            name="price"
            label="销售价格"
            rules={[{required: !sale, message: '请输入销售价格'}]}
          >
            <Input placeholder="请输入"/>
          </Form.Item>
        </div>
      </Form>
    );
  };

  return (
    <Modal
      title={done ? null : `${current ? '卖' : '添加'}`}
      className={styles.standardListForm}
      width={640}
      bodyStyle={done ? {padding: '72px 0'} : {padding: '28px 0 0'}}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
};

export default InventoryItem;
