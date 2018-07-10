import React from 'react';
import { Container } from 'semantic-ui-react';
import Header from './Header';

export default layoutDiv => {
	return (
		<Container>
			<Header/>
			{layoutDiv.children}
		</Container>
	);
};