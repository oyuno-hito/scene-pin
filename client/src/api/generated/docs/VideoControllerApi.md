# VideoControllerApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**delete1**](VideoControllerApi.md#delete1) | **DELETE** /api/videos/{id} |  |
| [**get**](VideoControllerApi.md#get) | **GET** /api/videos/{id} |  |
| [**getFile**](VideoControllerApi.md#getfile) | **GET** /api/videos/{id}/file |  |
| [**list**](VideoControllerApi.md#list) | **GET** /api/videos |  |
| [**update1**](VideoControllerApi.md#update1) | **PATCH** /api/videos/{id} |  |



## delete1

> delete1(id)



### Example

```ts
import {
  Configuration,
  VideoControllerApi,
} from '';
import type { Delete1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VideoControllerApi();

  const body = {
    // number
    id: 789,
  } satisfies Delete1Request;

  try {
    const data = await api.delete1(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## get

> VideoResponse get(id)



### Example

```ts
import {
  Configuration,
  VideoControllerApi,
} from '';
import type { GetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VideoControllerApi();

  const body = {
    // number
    id: 789,
  } satisfies GetRequest;

  try {
    const data = await api.get(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**VideoResponse**](VideoResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getFile

> Blob getFile(id)



### Example

```ts
import {
  Configuration,
  VideoControllerApi,
} from '';
import type { GetFileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VideoControllerApi();

  const body = {
    // number
    id: 789,
  } satisfies GetFileRequest;

  try {
    const data = await api.getFile(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

**Blob**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## list

> Array&lt;VideoResponse&gt; list(tags)



### Example

```ts
import {
  Configuration,
  VideoControllerApi,
} from '';
import type { ListRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VideoControllerApi();

  const body = {
    // Array<number> (optional)
    tags: ...,
  } satisfies ListRequest;

  try {
    const data = await api.list(body);
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
| **tags** | `Array<number>` |  | [Optional] |

### Return type

[**Array&lt;VideoResponse&gt;**](VideoResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## update1

> VideoResponse update1(id, videoUpdateRequest)



### Example

```ts
import {
  Configuration,
  VideoControllerApi,
} from '';
import type { Update1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VideoControllerApi();

  const body = {
    // number
    id: 789,
    // VideoUpdateRequest
    videoUpdateRequest: ...,
  } satisfies Update1Request;

  try {
    const data = await api.update1(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |
| **videoUpdateRequest** | [VideoUpdateRequest](VideoUpdateRequest.md) |  | |

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
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

