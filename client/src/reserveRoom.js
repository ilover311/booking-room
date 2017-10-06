import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';
import moment from 'moment';

class ReserveRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      roomNo: "",
      roomName: "",
      attendee: [],
      bookings: [],
    }
  }

  componentDidMount() {
    this.initRoomList()
  }

  initRoomList() {
    let _this = this;
    axios.get('/api/roomlist', {})
    .then(value => {
      _this.setState({
        search_result: value.data.rooms,
      })
    })
    .catch(err => {
      console.error(err);
    })
  }

  initReserve(row) {
    console.log(row)
    this.setState({
      roomNo: row['roomNo'],
      roomName: row['roomName'],
      date: undefined,
      booking_list: [],
    })
  }

  getBooking(date) {
    let _date = moment(date).format('YYYY-MM-DD');
    axios.get(`/api/bookings?roomNo=${this.state.roomNo}&date=${_date}`, {})
    .then(value => {
      this.setState({ bookings: value.data.bookings })
    })
    .catch(err => {
      console.error(err);
    })
  }

  reserverRoom() {
    axios.post('/api/reserve', {
      roomNo: this.state.roomNo,
      date: moment(this.state.date).format('YYYY-MM-DD'),
      startTime: moment(this.state.startTime).format('HH:mm:00'),
      endTime: moment(this.state.endTime).format('HH:mm:00'),
      attendee: this.state.attendee.join()
    })
    .then(val => {
      this.setState({
        sb_open: true,
        sb_msg: val.data.msg
      })
    })
    .catch(err => {
      console.error(err)
      this.setState({
        sb_open: true,
        sb_msg: err
      })
    })
  }
  
  handleRequestClose = () => {
    this.setState({
      sb_open: false
    })
  };

  render() {
    const selectRow = {
      mode: 'radio',
      bgColor: 'pink',
      hideSelectColumn: true,
      clickToSelect: true
    }

    const options = {
      onRowClick: this.initReserve.bind(this)
    }

    return (
      <div style={{margin: 50}}>
        <div className="Table" >
          <span className="subTitle" style={{alignContent: 'center'}}>예약하고 싶은 회의실의 테이블을 클릭해주세요. 클릭 후 테이블 아래에서 예약을 진행 할 수 있습니다.</span>
          <BootstrapTable
            data={this.state.search_result}
            striped={true}
            pagination
            search
            selectRow={selectRow}
            options={options}
            >
            <TableHeaderColumn dataField="roomNo" isKey={true}>No</TableHeaderColumn>
            <TableHeaderColumn dataField="roomName" >회의실 이름</TableHeaderColumn>
            <TableHeaderColumn dataField="capacity" >수용인원</TableHeaderColumn>
            <TableHeaderColumn dataField="openTime" >개장시간</TableHeaderColumn>
            <TableHeaderColumn dataField="closeTime" >폐장시간</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <div>
        {
          this.state.roomNo ? (
            <div className="reserve-sheet">
              <div>
                <strong> 선택한 회의실 : No {this.state.roomNo} / {this.state.roomName} </strong>
                <p>예약할 일자</p>
                <DatePicker
                  hintText="예약하고 싶은 일자"
                  container="inline"
                  onChange={(ev, date) => {this.setState({date: date}); this.getBooking(date)}}
                />
                <br/>
                <div>
                  {this.state.bookings !== [] ? (
                    <div>
                      <span>예약 되어있는 시간들 (겹치는 시간에 예약이 불가능합니다)</span>
                      {this.state.bookings.map((key) => {
                        return (
                          <div>
                            {key.startTime} ~ {key.endTime}
                          </div>
                        )
                      })}
                      <br/>
                    </div>
                    ) : (<div>예약된 일정이 없습니다.</div>)}
                </div>
              </div>
              { this.state.date ? (
              <div className="reserve-info">
                  <div>
                  <p>회의 시작 시간</p>
                  <TimePicker
                    hintText="시작 시간"
                    format="24hr"
                    onChange={(ev, time) => {this.setState({startTime: time})}}
                  />
                  <br/>
                  <p>회의 종료 시간</p>
                  <TimePicker
                    hintText="종료 시간"
                    format="24hr"
                    onChange={(ev, time) => {this.setState({endTime: time})}}
                  />
                  </div>
                  <div>
                    <TextField
                      floatingLabelFixed={true}
                      floatingLabelText="참석자 이름"
                      value={this.state.attendee_text}
                      onChange={(ev, val) => {this.setState({attendee_text: val})}}/>
                    <RaisedButton
                      label="인원 추가"
                      onClick={(ev) => {
                        let t = this.state.attendee;
                        t.push(this.state.attendee_text)
                        this.setState({
                          attendee: t,
                          attendee_text: "",
                        })
                      }}/>
                    <List>
                      <Subheader>참석자 리스트</Subheader>
                      {
                        this.state.attendee.map((val, idx, ary) => {
                          return (
                            <ListItem
                              primaryText={val}
                            />
                          )
                        })
                      }
                    </List>
                  </div>
                  <RaisedButton
                    label="예약하기"
                    onClick={this.reserverRoom.bind(this)}/>
              </div>) : (<div></div>)
              }
            </div>
          ) : (
            <div>
              우선 원하시는 회의실을 클릭해주세요.
            </div>
          )
        }
        </div>
        <Snackbar
          open={this.state.sb_open}
          message={this.state.sb_msg}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

export default ReserveRoom;