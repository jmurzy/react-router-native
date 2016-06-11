/* eslint-disable */
/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  Text,
  PixelRatio,
  StyleSheet,
  View,
  TouchableHighlight,
} = ReactNative;

var NavigationExampleRow = React.createClass({
  render: function() {
    if (this.props.onPress) {
      return (
        <TouchableHighlight
          style={styles.row}
          underlayColor="#D0D0D0"
          onPress={this.props.onPress}>
          <Text style={styles.buttonText}>
            {this.props.text}
          </Text>
        </TouchableHighlight>
      );
    }
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>
          {this.props.text}
        </Text>
      </View>
    );
  },
});


module.exports = NavigationExampleRow;
