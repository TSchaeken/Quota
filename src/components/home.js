import React, { Component } from 'react';

class Home extends Component {
  constructor() {
    super();
  }

  render() {
    const loggedIn = this.props.loggedIn;
    const imageStyle = {
      width: 400
    };
    return (
      <div>
        {loggedIn ? (
          <div>
            <p>It's good to be home</p>
            <form
              action="/file/upload"
              method="POST"
              enctype="multipart/form-data"
            >
              <div class="custom-file mb-3">
                <input
                  type="file"
                  name="file"
                  id="file"
                  class="custom-file-input"
                />
                <label for="file" class="custom-file-label">
                  Choose File
                </label>
              </div>
              <input
                type="submit"
                value="Submit"
                class="btn btn-primary btn-block"
              />
            </form>
          </div>
        ) : (
          <div>
            <p> Not logged in my guy</p>
          </div>
        )}
      </div>
    );
  }
}

export default Home;
