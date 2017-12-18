import React from 'react';

import List from './list.jsx';
import View from './view.jsx';
import Edit from './edit.jsx';
import Add from './add.jsx';

class Container extends React.Component {
    render() {
        return (
            <div>
                <Edit />
                <View />
                <div style={{textAlign: 'left', padding: 20}}>
                    <Add />
                </div>
                <List />
            </div>
        );
    }
};

export default Container;
