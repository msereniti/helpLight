import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  message,
  Rate,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Axios from 'axios';
import uuidv4 from 'uuid/v4';
import { withRouter, router } from 'umi';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface BasicFormProps extends FormComponentProps {
  submitting: boolean;
  dispatch: Dispatch<any>;
}

class BasicForm extends Component<BasicFormProps> {
  state = { organization: null };

  componentDidMount() {
    Axios.get(`http://185.251.89.17/api/User/GetUserInfo?userId=${localStorage.getItem('user')}`, {
      headers: {
        token: localStorage.getItem('user'),
      },
    }).then(res => {
      if (res.data.organization) {
        this.setState({ organization: res.data.organization });
      }
    });
  }

  handleSubmit = (e: React.FormEvent) => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Axios.get(
          `http://185.251.89.17/api/Application/WasOnEvent?applicationId=${this.props.match.params.application}`,
          {
            headers: {
              token: localStorage.getItem('user'),
            },
          },
        ).then(() => {
          Axios.post(
            'http://185.251.89.17/api/ReviewOfVolunteer/AddVolunteerReview',
            {
              idReviewOfVolunteer: uuidv4(),
              idVolunteer: this.props.match.params.volunteer,
              idOrganization: this.state.organization.idOrganization,
              idEvent: this.props.match.params.event,
              stars: values.stars,
              review: values.review,
            },
            {
              headers: {
                token: localStorage.getItem('user'),
              },
            },
          ).then(() => {
            message.success('Отзыв оставлен!');
            router.push('/');
          });
        });
      }
    });
  };

  render() {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderWrapper content="Отзыв о деятельности волонтера">
        <p style={{ textAlign: 'center' }}></p>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ margin: 'auto', maxWidth: 400 }}
          >
            <FormItem>
              {getFieldDecorator('review', {
                rules: [],
              })(
                <Input.TextArea
                  style={{ minHeight: 100 }}
                  placeholder="Отзыв о работе волонтера"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('stars', {
                rules: [],
              })(<Rate />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Отправить заявку
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default withRouter(
  Form.create<BasicFormProps>()(
    connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
      submitting: loading.effects['formBasicForm/submitRegularForm'],
    }))(BasicForm),
  ),
);
