import React from 'react';
import axios from 'axios';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import DeteleForever from 'material-ui/svg-icons/action/delete-forever';
import moment from 'moment'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import './mybooking.css'

class Mybookings extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      mybookings: [],
      sb_open: false,
      sb_msg: "",
    }
  }

  componentDidMount() {
    this.initMyBooking()
  }

  initMyBooking() {
    axios.get('/api/mybookings')
    .then(val => {
      this.setState({mybookings: val.data.bookings})
    })  
    .catch(e => {
      console.error(e)
    })
  }

  initChangeBooking(row) {
    let d = row.date.split('-')
    let s = row.startTime.split(':')
    let e = row.endTime.split(':')
    let startTime = new Date(d[0], d[1]-1, d[2], s[0], s[1], s[2], '00')
    let endTime = new Date(d[0], d[1]-1, d[2], e[0], e[1], e[2], '00')
    if (moment(new Date()) >= moment(startTime)) {
      this.setState({
        sb_open: true,
        sb_msg: "지난 예약입니다. 수정 및 삭제가 불가능합니다."
      })
      return;
    }
    let roomNo = row.roomNo
    axios.get(`/api/room?roomNo=${roomNo}`)
    .then(val => {
      let r = val.data.room
      this.setState({
        bookingID: row.bookingID,
        attendee: row.attendee.split(','),
        startTime: startTime,
        endTime: endTime,
        roomNo: roomNo,
        date: row.date,
        roomName: r.roomName,
        openTime: r.openTime,
        closeTime: r.closeTime,
        capacity: r.capacity,
      })
    })
    .catch(e => {
      console.error(e)
    })
  }

  changeBooking() {
    axios.put('/api/changebooking', {
      bookingID: this.state.bookingID,
      roomNo: this.state.roomNo,
      date: moment(this.state.date).format('YYYY-MM-DD'),
      startTime: moment(this.state.startTime).format('HH:mm:00'),
      endTime: moment(this.state.endTime).format('HH:mm:00'),
      attendee: this.state.attendee.join(),
    })
    .then(res => {
      this.setState({
        bookingID: undefined,
        sb_open: true,
        sb_msg: res.data.msg
      })
      this.initMyBooking()
    })  
    .catch(e => {
      console.error(e)
    })
  }

  cancelBooking() {
    axios.delete(`/api/cancelbooking?bookingID=${this.state.bookingID}`)
    .then(res => {
      this.setState({
        bookingID: undefined,
        sb_open: true,
        sb_msg: res.data.msg
      })
      this.initMyBooking()
    })
    .catch(err => {

    })
  }
  render() {
    const selectRow = {
      mode: 'radio',
      bgColor: 'pink',
      hideSelectColumn: true,
      clickToSelect: true
    }

    const options = {
      onRowClick: this.initChangeBooking.bind(this)
    }

    return (
      <div style={{margin: 50}}>
        <div>
          <p> 회의실 사용 시작 시간 전까지 테이블을 클릭하여 아래에서 정보 수정 및 예약 삭제가 가능합니다.</p>
          <BootstrapTable
            data={this.state.mybookings}
            striped={true}
            pagination
            search
            selectRow={selectRow}
            options={options}>
            <TableHeaderColumn dataField="bookingID" isKey={true} dataSort>예약 번호</TableHeaderColumn>
            <TableHeaderColumn dataField="roomNo" dataSort>회의실 No</TableHeaderColumn>
            <TableHeaderColumn dataField="date" dataSort>일자</TableHeaderColumn>
            <TableHeaderColumn dataField="startTime" dataSort>시작시간</TableHeaderColumn>
            <TableHeaderColumn dataField="endTime" dataSort>종료시간</TableHeaderColumn>
            <TableHeaderColumn dataField="attendee" >참가자</TableHeaderColumn>
          </BootstrapTable>
        </div>
        <div>
          {
            this.state.bookingID ? (
              <div>
                <Divider/>
                <br/>
                <div className="booking-info">
                <p> 선택된 예약 번호 : { this.state.bookingID } / 선택된 회의실 No : {this.state.roomNo}</p>
                <p> 선택한 회의실 정보 > 개장시간 : {this.state.openTime} / 폐장시간 : {this.state.closeTime} / 수용인원 : {this.state.capacity} </p>
                </div>
                <div className="booking-info right">
                  <RaisedButton
                    label="예약취소"
                    secondary={true}
                    onClick={() => {this.cancelBooking()}}
                  />
                </div>
                <br/>
                <Divider/>
                <br/>
                <div className="edit-page">
                  <p>예약 수정하기</p>
                  <div>
                    <div className="time">
                      <p>회의 시작 시간</p>
                      <TimePicker
                        hintText="시작 시간"
                        format="24hr"
                        value={this.state.startTime}
                        onChange={(ev, time) => {this.setState({startTime: time})}}
                      />
                    </div>
                    <div className="time">
                      <p>회의 종료 시간</p>
                      <TimePicker
                        hintText="종료 시간"
                        format="24hr"
                        value={this.state.endTime}
                        onChange={(ev, time) => {this.setState({endTime: time})}}
                      />
                    </div>
                  </div>
                  <div>
                    <TextField
                      floatingLabelFixed={true}
                      floatingLabelText="참석자 이름"
                      value={this.state.attendee_text}
                      onChange={(ev, val) => {this.setState({attendee_text: val})}}/>
                      <span>  </span>
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
                    <br/>
                    <Paper>
                      <List>
                        <Subheader>참석자 리스트 (아래 클릭시 리스트에서 삭제 됩니다.)</Subheader>
                        {
                          this.state.attendee.map((val, idx, ary) => {
                            return (
                              <ListItem
                                primaryText={val}
                                key={val + idx}
                                rightIcon={<DeteleForever/>}
                                onClick={(ev) => {
                                  let a = this.state.attendee;
                                  a.splice(idx, 1);
                                  this.setState({ attendee: a });
                                }}
                              />
                            )
                          })
                        }
                      </List>
                    </Paper>
                    <br/>
                    <RaisedButton
                      label="수정"
                      primary={true}
                      onClick={() => {this.changeBooking()}}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )
          }

        </div>
        <Snackbar
          open={this.state.sb_open}
          message={this.state.sb_msg}
          autoHideDuration={4000}
          onRequestClose={() => {this.setState({ sb_open: false })}}
        />
      </div>
    )
  }
}

export default Mybookings;