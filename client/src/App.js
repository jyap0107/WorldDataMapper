import React 			from 'react';
import Homescreen 		from './components/homescreen/Homescreen';
import { useQuery } 	from '@apollo/client';
import * as queries 	from './cache/queries';
import { jsTPS } 		from './utils/jsTPS';
import { HashRouter, BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
 
const App = () => {
	let user = null;
    let transactionStack = new jsTPS();
	
    const { loading, error, data, refetch } = useQuery(queries.GET_DB_USER);

    if(error) { 
		console.log(error); 
	}
	if(loading) { console.log(loading); }
	if(data) { 
		console.log(data);
		let { getCurrentUser } = data;
		if(getCurrentUser !== null) { user = getCurrentUser; }
    }

	return(
		<HashRouter>
			<Switch>
				<Redirect exact from="/" to={ {pathname: "/welcome"} } />
				<Route 
					path="/welcome" 
					name="welcome" 
					render={() => 
						<Homescreen tps={transactionStack} fetchUser={refetch} user={user} />
					} 
				/>
				<Route/>
			</Switch>
		</HashRouter>
	);
}

export default App;