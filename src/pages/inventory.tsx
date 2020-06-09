import React, {FC, useEffect, useRef, useState} from 'react';
import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Dropdown, Input, List, Menu, Modal, Radio, Row,} from 'antd';

import {findDOMNode} from 'react-dom';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect, Dispatch} from 'umi';
import InventoryItem from './InventoryItem';
import {StateType} from '@/models/model';
import {InventoryItemModel, Sale} from './inventory.d';
import styles from './style.less';
import {Remain} from "@/services/service";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Search} = Input;

interface InventoryProps {
  inventory: StateType;
  dispatch: Dispatch;
  loading: boolean;
}

const Info: FC<{
  title: React.ReactNode;
  value: React.ReactNode;
  bordered?: boolean;
}> = ({title, value, bordered}) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em/>}
  </div>
);

const ListContent = ({
                       data: {
                         purchaseOrder, product, size, purchaseQuantities, purchaseCost, purchaseTotalCost,
                         price, saleQuantities, remainQuantities, profit
                       }
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
    inventory: {list},
  } = props;
  const [done, setDone] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [sale, setSale] = useState<boolean>(false);
  const [current, setCurrent] = useState<Partial<InventoryItemModel> | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [remain, setRemain] = useState<Remain>(Remain.NULL);
  const [showSize, setShowSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const paginationProps = {
    showSizeChanger: true,
    pageSize: showSize,
    total: list.totalSize,
    current: currentPage,
    onChange: (current: number) => {
      setCurrentPage(current);
      dispatch({
        type: 'inventory/fetch',
        payload: {
          pageSize: showSize,
          pageIndex: current,
          search: search,
          remain: remain,
        },
      });
    },
    onShowSizeChange: (current: number, size: number) => {
      setCurrentPage(current)
      setShowSize(size);
      dispatch({
        type: 'inventory/fetch',
        payload: {
          pageSize: size,
          pageIndex: current,
          search: search,
          remain: remain,
        },
      });
    },
  };

  useEffect(() => {
    dispatch({
      type: 'inventory/fetch',
      payload: {
        pageSize: paginationProps.pageSize,
        pageIndex: paginationProps.current,
        search: search,
        remain: remain,
      },
    });
  }, [1]);

  const onSearch = (search: string) => {
    setSearch(search);
    dispatch({
      type: 'inventory/fetch',
      payload: {
        pageSize: paginationProps.pageSize,
        pageIndex: paginationProps.current,
        search: search,
        remain: remain,
      },
    });
  };

  const onAllClick = () => {
    setRemain(Remain.NULL);
    dispatch({
      type: 'inventory/fetch',
      payload: {
        pageSize: paginationProps.pageSize,
        pageIndex: paginationProps.current,
        search: search,
        remain: Remain.NULL,
      },
    });
  }

  const onRemainClick = () => {
    setRemain(Remain.REMAIN);
    dispatch({
      type: 'inventory/fetch',
      payload: {
        pageSize: paginationProps.pageSize,
        pageIndex: paginationProps.current,
        search: search,
        remain: Remain.REMAIN,
      },
    });
  }

  const onNoRemainClick = () => {
    setRemain(Remain.NO_REMAIN);
    dispatch({
      type: 'inventory/fetch',
      payload: {
        pageSize: paginationProps.pageSize,
        pageIndex: paginationProps.current,
        search: search,
        remain: Remain.NO_REMAIN,
      },
    });
  }

  const showModal = () => {
    setVisible(true);
    setCurrent(undefined);
    setSale(false);
  };

  const showEditModal = (item: InventoryItemModel) => {
    setVisible(true);
    setSale(true);
    setCurrent(item);
  };

  const deleteItem = (id: string) => {
    dispatch({
      type: 'inventory/submit',
      payload: {id},
    });
  };

  const editAndDelete = (key: string, currentItem: InventoryItemModel) => {
    if (key === 'sale') showEditModal(currentItem);
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
        <RadioButton value="all" onClick={onAllClick}>全部</RadioButton>
        <RadioButton value="remained" onClick={onRemainClick}>未售罄</RadioButton>
        <RadioButton value="noRemain" onClick={onNoRemainClick}>已售磬</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={onSearch}/>
    </div>
  );

  const MoreBtn: React.FC<{
    item: InventoryItemModel;
  }> = ({item}) => (
    <Dropdown
      overlay={
        <Menu onClick={({key}) => editAndDelete(key, item)}>
          <Menu.Item key="sale">销售</Menu.Item>
          <Menu.Item key="delete">删除</Menu.Item>
        </Menu>
      }
    >
      <a>
        操作 <DownOutlined/>
      </a>
    </Dropdown>
  );

  const setAddBtnBlur = () => {
    if (addBtn.current) {
      const addBtnDom = findDOMNode(addBtn.current) as HTMLButtonElement;
      setTimeout(() => addBtnDom.blur(), 0);
    }
  };

  const handleDone = () => {
    setAddBtnBlur();

    setDone(false);
    setVisible(false);
  };

  const handleCancel = () => {
    setAddBtnBlur();
    setVisible(false);
  };

  const handleSubmit = (sale: boolean, values: InventoryItemModel | Sale) => {
    const id = current ? current.id : '';

    setAddBtnBlur();

    setDone(true);
    dispatch({
      type: 'inventory/submit',
      payload: {id, sale, ...values},
    });
  };

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="总收入" value={list.totalSale} bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="总支出" value={list.totalCost} bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="盈利" value={list.totalProfit}/>
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="库存"
            style={{marginTop: 24}}
            bodyStyle={{padding: '0 32px 40px 32px'}}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{width: '100%', marginBottom: 8}}
              onClick={showModal}
              ref={addBtn}
            >
              <PlusOutlined/>
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
                    <MoreBtn key="more" item={item}/>,
                  ]}
                >
                  <ListContent data={item}/>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>

      <InventoryItem
        done={done}
        current={current}
        visible={visible}
        sale={sale}
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
