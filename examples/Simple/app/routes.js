/* @noflow */
import React from 'react';
import {
  Header,
  Link,
  nativeHistory,
  Route,
  Router,
  StackRoute,
  withRouter,
} from 'react-router-native';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  component: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  home: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  detailCard: {
    height: 100,
    margin: 20,
    width: 100,
  },
});

const Master = (props) => (
  <View style={styles.component}>
    {props.children}
  </View>
);

const HomeHeader = withRouter((props) => {
  const handleRightButtonPress = () => {
    props.router.push('/detail/gray');
  };

  return (
    <Header
      {...props}
      style={{ backgroundColor: '#26BBE5' }}
      title="Feed"
      rightButtonText="Gray"
      onRightButtonPress={handleRightButtonPress}
    />
  );
});

const Home = () => {
  const DetailCard = ({ backgroundColor }) => (
    <Link to={`/detail/${encodeURIComponent(backgroundColor)}`} style={styles.detailCard}>
      <View style={{ flex: 1, backgroundColor }} />
    </Link>
  );

  return (
    <ScrollView style={styles.component} contentContainerStyle={styles.home}>
      <DetailCard backgroundColor="#EF4E5E" />
      <DetailCard backgroundColor="#9498CA" />
      <DetailCard backgroundColor="#AFCCB3" />
      <DetailCard backgroundColor="#F0D73D" />
      <DetailCard backgroundColor="#A176B0" />
      <DetailCard backgroundColor="#416BB4" />
      <DetailCard backgroundColor="#94B5DC" />
      <DetailCard backgroundColor="#D48445" />
    </ScrollView>
  );
};

const DetailHeader = withRouter((props) => {
  const { routeParams } = props;
  const title = routeParams.themeColor;
  const backgroundColor = routeParams.themeColor;
  const colors = ['#EF4E5E', '#D48445', '#AFCCB3', '#F0D73D', '#A176B0'];

  const handleRightButtonPress = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    props.router.push(`/detail/${encodeURIComponent(randomColor)}`);
  };

  return (
    <Header
      {...props}
      title={title}
      style={{ backgroundColor }}
      leftButtonText="Back"
      rightButtonText="Random"
      onRightButtonPress={handleRightButtonPress}
    />
  );
});

const Detail = (props) => (
  <View style={[styles.component, { backgroundColor: '#FFFFFF' }]}>{props.children}</View>
);

const routes = (
  /* Address Bar can be toggled on or off by setting the addressBar prop */
  <Router history={nativeHistory} addressBar>
    <StackRoute path="master" component={Master}>
      <Route path="/" component={Home} overlayComponent={HomeHeader} />
      <Route path="/detail/:themeColor" component={Detail} overlayComponent={DetailHeader} />
    </StackRoute>
  </Router>
);

export default routes;
