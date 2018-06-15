import React   from 'react';
import { Mutation } from 'react-apollo';
import { STOCK_HOLD_TABLE_MUTATION_DELETE } from '../../../../_service/stock/graphql/holdtable';


class MutationTableContainer extends React.Component{

    render() {
        let a=['a','b'];
        let input ;
        return (
                <Mutation mutation={STOCK_HOLD_TABLE_MUTATION_DELETE}>
                {(REMOVE_HOLD_TABLE_ITEM, { data }) => (
                    <div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                REMOVE_HOLD_TABLE_ITEM({ variables: { id_list: a } });
                            input.value = "";
                        }}
                    >
                    <input
                        ref={node => {input = node;}} />
                <button type="submit">DELETE</button>
              </form>
            </div>
          )}
        </Mutation>

      );
    }
}
export default MutationTableContainer;
