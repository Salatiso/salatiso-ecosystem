import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill fetch for Node.js environment (required by OpenAI SDK)
global.fetch = jest.fn();
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

if (typeof (global as any).TransformStream === 'undefined') {
	class MockTransformStream {}
	(global as any).TransformStream = MockTransformStream;
}

process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??= 'test-api-key';
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??= 'test-project.firebaseapp.com';
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??= 'test-project';
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??= 'test-project.appspot.com';
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??= '1234567890';
process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??= '1:1234567890:web:testappid';
