import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import './SearchRoom.css';

class SearchRoom extends React.Component {
  constructor(props) {
    super(props);
    
    
    this.state = {
      rooms: ['전체', '회의실1', '회의실2', '회의실3'],
      selected_room: '전체',
      option_date: '',
      option_time: '',
      start_datetime: Date,
      end_datetime: Date,
      search_option: {},
      search_result: []
    }
  }

  compomentDidMount() {

  }

  findRooms() {
    // getting search result by using axios
    console.log('click findRoom');
  }

  render() {
    return (
      <div>
        <div className="Search">
          <span className="subTitle"> 사용 가능한 회의실 검색 </span>
          <br/>
          <div className="SearchCondition">
            <DropDownMenu value={this.state.selected_room} onChange={(ev, idx, val) => {this.setState({selected_room: val})}}>
              {this.state.rooms.map((key) => {
                return (
                  <MenuItem value={key} primaryText={key}/>
                );
              })}
            </DropDownMenu>
            <DatePicker
              hintText="일자"
              container="inline"
              />
            <RaisedButton
              style={{height: '150%'}}
              label="검색"
              onClick={this.findRooms.bind(this)}
              
              />
          </div>
        </div>
        <div className="Result">
          <span className="subTitle"> 사용 가능한 회의실</span>
          
        </div>
      </div>
    );
  }
};

export default SearchRoom;