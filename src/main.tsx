import ReactDOM from 'react-dom/client';
import { store } from './app/store.ts';
import { Provider } from 'react-redux';
import { App } from './App.tsx';
import { ConfigProvider } from 'antd';
import { providerStyleConfig } from '@/config/providerStyle.config.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<ConfigProvider {...providerStyleConfig}>
		<Provider store={store}>
			<App />
		</Provider>
	</ConfigProvider>
);
