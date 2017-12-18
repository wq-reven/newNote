import React from 'react';

import List from './list.jsx';
import Search from './search.jsx';

class Container extends React.Component {
    render() {
        return (
            <div>
                <Search />
                <List />
            </div>
        );
    }
};

export default Container;
