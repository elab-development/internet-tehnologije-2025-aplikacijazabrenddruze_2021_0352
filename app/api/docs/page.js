'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import spec from '../../../swagger.json';

export default function ApiDocs() {
  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}