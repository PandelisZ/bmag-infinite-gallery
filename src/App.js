import React, { Component } from 'react';
import './App.css';
import InfiniteScroll from 'react-infinite-scroller';
import Lightbox from 'react-image-lightbox';
import qwest from 'qwest';
import 'bulma';

const api = {
  baseUrl: 'https://sheetlabs.com/BMAG/bmagremixedv2',
};

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      artwork: [],
      hasMoreItems: true,
      nextHref: null,
      photoIndex: 0,
      isOpen: true,
    };
  }

  loadItems(page) {
    const self = this;
    var url = api.baseUrl;
    qwest.get(url, {
      imageid: `${(page * 10) - 9}..${page * 10}`
    }, {
        cache: true
      })
      .then(function (xhr, resp) {
        if (resp) {
          var work = self.state.artwork;
            self.setState({ 
              artwork: work.concat(resp),
              hasMoreItems: true
            })
        }
      });
  }

  render() {

    const loader = <div className="loader">Loading ...</div>;
    const highResSources = this.state.artwork.map(a => a.imagehighres);
    const photoIndex = this.state.photoIndex;

    var items = [];
    const work = this.state.artwork;
    work.forEach((image) => {
      items.push(
        <div key={image.imageid.toString()} className="d-flex align-items-start" >
          <div onClick=>
            <img src={image.imagethumb} alt={image.title} width="400" />
            <p className="title">{image.title}</p>
          </div>
        </div>
      );
    });

    return (
      <div className="mx-auto App">
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadItems.bind(this)}
          hasMore={this.state.hasMoreItems}
          loader={loader}>
          <div className="d-flex flex-wrap align-content-around artwork justify-content-center">
            {items}
          </div>
        </InfiniteScroll>
        {
          this.state.isOpen && (
            <Lightbox
              mainSrc={highResSources[photoIndex]}
              nextSrc={highResSources[(photoIndex + 1) % highResSources.length]}
              prevSrc={highResSources[(photoIndex + highResSources.length - 1) % highResSources.length]}
              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + highResSources.length - 1) % highResSources.length,
                })
              }
              onMoveNextRequest={() =>
                this.setState({
                  photoIndex: (photoIndex + 1) % highResSources.length,
                })
              }
            />
          )
        }
      </div>

    );
  }
}

export default App;
