export function FetchStockDataFromStore(apollo_client,symbol_list){
    let result = new Map();
    symbol_list.map((id)=>{
        const obj_id = 'StockType:' + id;
        let item = apollo_client.store.cache.data.get(obj_id);
        if (item) {
            result.set(id,item);
        }
    });
    return result;
}

export function FetchStockIndexDataFromStore(apollo_client,symbol_list){
    let result = new Map();
    symbol_list.map((id)=>{
        const obj_id = 'StockIndex_Type:' + id;
        let item = apollo_client.store.cache.data.get(obj_id);
        if (item) {
            result.set(id,item);
        }
    });
    return result;
}