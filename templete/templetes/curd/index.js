import React from 'react';

import List from './list.jsx';
import Search from './search.jsx';
import View from './view.jsx';
import Edit from './edit.jsx';
import Add from './add.jsx';
import AddPlus from './addPlus.jsx';

class Container extends React.Component {
    render() {
        return (
            <div>
                <Edit />
                <View />
                <Search />
                <div style={{textAlign: 'right', paddingBottom: 20}}>
                    <Add /> <AddPlus />
                </div>
                <List />
            </div>
        );
    }
};

export default Container;
