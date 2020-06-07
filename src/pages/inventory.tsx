import React, { FC, useRef, useState, useEffect } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  Radio,
  Row,
} from 'antd';

import { findDOMNode } from 'react-dom';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import OperationModal from './OptionModel';
import { StateType } from '../models/model';
import { InventoryItemModel } from './inventory.d';
import styles from './style.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

interface InventoryProps {
  inventory: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({
  data: { purchaseOrder, product, size, purchaseQuantities, purchaseCost, purchaseTotalCost,
    price, saleQuantities, remainQuantities, profit }
}: {
  data: InventoryItemModel
}) => (
    <div className={styles.listContent}>
      <div className={styles.listContentItem}>
        <span>采购单</span>
        <p>{purchaseOrder}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>产品</span>
        <p>{product}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>尺码</span>
        <p>{size}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>采购数量</span>
        <p>{purchaseQuantities}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>采购单价</span>
        <p>{purchaseCost}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>采购总价</span>
        <p>{purchaseTotalCost}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>销售单价</span>
        <p>{price}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>已销数量</span>
        <p>{saleQuantities}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>剩余数量</span>
        <p>{remainQuantities}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>盈利</span>
        <p>{profit}</p>
      </div>
    </div>
  );

export const Inventory: FC<InventoryProps> = (props) => {
  const addBtn = useRef(null);
  const {
    loading,
    dispatch,
    inventory: { list },
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<InventoryItemModel> | undefined>(undefined);

  useEffect(() => {
    dispatch({
      type: 'inventory/fetch',
      payload: {
        count: 5,
      },
    });
  }, [1]);

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 5,
    total: 50,
  };

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
  };

  const showEditModal = (item: InventoryItemModel) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    dispatch({
      type: 'inventory/submit',
      payload: { id },
    });
  };

  const editAndDelete = (key: string, currentItem: InventoryItemModel) => {
    if (key === 'edit') showEditModal(currentItem);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除库存',
        content: '确定删除该库存吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteItem(currentItem.id),
      });
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup defaultValue="all">
        <RadioButton value="all">全部</RadioButton>
        <RadioButton value="progress">已售磬</RadioButton>
        <RadioButton value="waiting">未售罄</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
    </div>
  );

  const MoreBtn: React.FC<{
    item: InventoryItemModel;
  }> = ({ item }) => (
    <Dropdown
      overlay={
        <Menu onClick={({ key }) => editAndDelete(key, item)}>
          <Menu.Item key="edit">编辑</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        更多 <DownOutlined />
      </a>
    </Dropdown>
  );

  const setAddBtnblur = () => {
    if (addBtn.current) {
      // eslint-disable-next-line react/no-find-dom-node
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnblur();

    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnblur();
    setVisible(false);
  };

  const handleSubmit = (values: InventoryItemModel) => {
    const id = current ? current.id : '';

    setAddBtnblur();

    setDone(true);
    dispatch({
      type: 'inventory/submit',
      payload: { id, ...values },
    });
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="总收入" value={list.totalSale} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="总支出" value={list.totalCost} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="盈利" value={list.totalProfit} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="库存"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined />
              添加
            </Button>

            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list.items}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <MoreBtn key="more" item={item} />,
                  ]}
                >
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <OperationModal
        done={done}
        current={current}
        visible={visible}
        onDone={handleDone}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(
  ({
    inventory,
    loading,
  }: {
    inventory: StateType;
    loading: {
      models: { [key: string]: boolean };
    };
  }) => ({
    inventory,
    loading: loading.models.inventory,
  }),
)(Inventory);
