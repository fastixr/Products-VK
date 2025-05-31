import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import { ItemsTable } from './components/ItemsTable';
import { CreateItemForm } from './components/CreateItemForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Items Management
          </Typography>
          <CreateItemForm />
          <Box sx={{ mt: 4 }}>
            <ItemsTable />
          </Box>
        </Box>
      </Container>
    </QueryClientProvider>
  );
}

export default App;
