import React, { Component } from 'react';
import './App.css';
import InfiniteScroll from 'react-infinite-scroller';
import qwest from 'qwest';

const api = {
    baseUrl: 'https://sheetlabs.com/BMAG/bmagremixedv2',
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
        artwork: [],
        hasMoreItems: true,
        nextHref: null
    };
}

loadItems(page) {
    const self = this;
    var url = api.baseUrl;
    qwest.get(url, {
        imageid: `${(page*10)-9}..${page*10}`
        }, {
            cache: true
        })
        .then(function(xhr, resp) {
            if(resp) {
              var work = self.state.artwork;
                resp.forEach((art) => {
                  work.push(art);
                });
            }
            self.setState({
              hasMoreItems: true
          });
        });
}
  
  render() {

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
    const work = this.state.artwork;
    work.forEach((image) => {
        items.push(
            <div key={image.imageid.toString()} className="artwork" >
                <a href={image.imagehighres} target="_blank">
                    <img src={image.imagethumb} alt={image.title} width="500" />
                    <p className="title">{image.title}</p>
                </a>
            </div>
        );
    });

    return (
      <div>
      <InfiniteScroll
                pageStart={0}
                loadMore={this.loadItems.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={loader}>
                <div className="tracks">
                {items}
                </div>
            </InfiniteScroll>
      </div>
      
  );
  }
}

export default App;
