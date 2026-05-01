# VideoUploadControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**upload**](VideoUploadControllerApi.md#uploadoperation) | **POST** /api/videos/upload |  |



## upload

> VideoResponse upload(uploadRequest)



### Example

```ts
import {
  Configuration,
  VideoUploadControllerApi,
} from '';
import type { UploadOperationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VideoUploadControllerApi();

  const body = {
    // UploadRequest (optional)
    uploadRequest: ...,
  } satisfies UploadOperationRequest;

  try {
    const data = await api.upload(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **uploadRequest** | [UploadRequest](UploadRequest.md) |  | [Optional] |

### Return type

[**VideoResponse**](VideoResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

